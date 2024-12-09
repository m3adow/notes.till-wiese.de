---
share: true
---

Using [OAuth2-Proxy](https://oauth2-proxy.github.io/oauth2-proxy/) as an authentication sidecar can be very useful to decouple authentication from the application. As OAuth2 is normally implemented in enterprises anyways, configuring OAuth2-Proxy doesn't take a lot of effort.

I'll use Azure AD as an example, but all of the providers are very similarly in their prerequisites.

## Prerequisites

- The Azure tenant ID
- The client ID of an existing or new OAuth2 application
- The client secret of that OAuth2 application

## Existing Situation

This is the (very simple) application we want to protect

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: static-page
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
      containers:
        # Show a simple static 404 site when started
        - name: static-page
          image: lipanski/docker-static-website:latest
          ports:
            - name: http
              containerPort: 3000
          resources:
            requests:
              cpu: 10m
              memory: 50Mi
            limits:
              memory: 50Mi
          securityContext:
            allowPrivilegeEscalation: false
            runAsUser: 1000
          volumeMounts:
            - name: index
              mountPath: /home/static/index.html
              subPath: index.html
      volumes:
        - name: index
          configMap:
            name: static-page-index
            items:
            - key: index.html
              path: index.html
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: static-page-index
data:
  index.html: |
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>404 - Page Not Found in Space</title>
        <style>
            body {
                font-family: 'Comic Sans MS', cursive;
                text-align: center;
                background-color: #f0f0f0;
                padding: 50px;
            }
            .error-code {
                font-size: 120px;
                color: #ff6b6b;
                margin: 0;
            }
            .message {
                font-size: 24px;
                color: #666;
            }
            .cookie-message {
                font-size: 18px;
                color: #888;
                margin-top: 50px;
            }
        </style>
    </head>
    <body>
        <h1 class="error-code">404</h1>
        <p class="message">Oops! This page is like my code - it exists somewhere, but nobody knows where.</p>
        <p class="message">Maybe it's taking a coffee break or got lost in the cloud.</p>
        <p class="cookie-message">Fun fact: The Cookie Monster would love this page - it always accepts cookies!</p>
        <button onclick="alert('Even this button is confused about its purpose!')">Click me maybe?</button>
    </body>
    </html>
---
apiVersion: v1
kind: Service
metadata:
  name: static-page-service
spec:
  ports:
    - name: http
      port: 3000
      targetPort: http
```

This is an Ingress agnostic configuration, thusly I will omit the Ingress.

## Configuration

First, lets configure OAuth2-Proxy. We'll do this via environment variables injected into the container with `envFrom`.

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: oauth2-proxy-config
data:
  # Only log the actual authentication, but don't log requests or heartbeats
  OAUTH2_PROXY_AUTH_LOGGING: "true"
  OAUTH2_PROXY_REQUEST_LOGGING: "false"
  OAUTH2_PROXY_SILCENE_PING_LOGGING: "true"
  # Listen to every interface, not only to localhost
  OAUTH2_PROXY_HTTP_ADDRESS: ":4180"
  # Enable Prometheus metrics
  OAUTH2_PROXY_METRICS_ADDRESS: ":9100"

  OAUTH2_PROXY_SKIP_PROVIDER_BUTTON: "true"
  # Use the port the original application is listening to
  OAUTH2_PROXY_UPSTREAMS: "http://localhost:3000"
  # Don't use the plain PKCE code challenge
  OAUTH2_PROXY_CODE_CHALLENGE_METHOD: "S256"
  # Limit this to the domains of your company if required
  OAUTH2_PROXY_EMAIL_DOMAINS: "*"

  # Provider specific settings, Azure in this case
  OAUTH2_PROXY_PROVIDER: azure
  OAUTH2_PROXY_AZURE_TENTANT: <INSERT AZURE TENANT ID HERE>
  OAUTH2_PROXY_CLIENT_ID: <INSERT AZURE OAUTH2 APPLICATION CLIENT ID HERE>
  OAUTH2_PROXY_OIDC_ISSUER_URL: https://login.microsoftonline.com/<INSERT AZURE TENANT ID HERE>/v2.0
---
apiVersion: v1
kind: Secret
metadata:
  name: oauth2-proxy-secrets
type: Opaque
stringData:
  # These values are sensitive and should not be added to any CVS unencrypted
  OAUTH2_PROXY_COOKIE_SECRET: <INSERT COOKIE SECRET HERE, SEE https://oauth2-proxy.github.io/oauth2-proxy/configuration/overview/#generating-a-cookie-secret FOR GENERATION COMMANDS>
    OAUTH2_PROXY_CLIENT_SECRET: <INSERT AZURE OAUTH2 APPLICATION SECRET HERE>
```

Now we need to adapt the existing Deployment and service accordingly. Note how the initial `static-page` container is not change at all.

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: static page
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
      containers:
        - name: static-page
          image: lipanski/docker-static-website:latest
          ports:
            - name: http
              containerPort: 3000
          resources:
            requests:
              cpu: 10m
              memory: 50Mi
            limits:
              memory: 50Mi
          securityContext:
            allowPrivilegeEscalation: false
            runAsUser: 1000
          volumeMounts:
            - name: index
              mountPath: /home/static/index.html
              subPath: index.html
        # OAuth2-Proxy sidecar container
        - name: oauth2-proxy
          image: quay.io/oauth2-proxy/oauth2-proxy:v7.7.1
          ports:
            - name: oauth-http
              containerPort: 4180
          envFrom:
            - configMapRef:
                name: oauth2-proxy-config
            - secretRef:
                name: oauth2-proxy-secrets
          resources:
            requests:
              cpu: 10m
              memory: 20Mi
            limits:
              memory: 20Mi
          securityContext:
            allowPrivilegeEscalation: false
            runAsUser: 65532
      volumes:
        - name: index
          configMap:
            name: static-page-index
            items:
            - key: index.html
              path: index.html
---
apiVersion: v1
kind: Service
metadata:
  name: static-page-service
spec:
  ports:
    - name: oauth-http
      port: 4180
      targetPort: oauth-http
```

That's it. Now the application is protected by OAuth2-Proxy and a login with the underlying provider is required before being able to access the static page.
