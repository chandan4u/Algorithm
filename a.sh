#!/bin/bash
# install-nginx-ingress.sh
# This script installs the NGINX Ingress Controller using Helm on your Kubernetes cluster.

set -e

# Check for kubectl
if ! command -v kubectl &> /dev/null; then
  echo "kubectl not found. Please install kubectl before running this script."
  exit 1
fi

# Check for helm
if ! command -v helm &> /dev/null; then
  echo "Helm not found. Please install Helm before running this script."
  exit 1
fi

# Add the NGINX Ingress Controller Helm repository
helm repo add nginx-stable https://helm.nginx.com/stable
helm repo update

# Create a namespace for the ingress controller
kubectl create namespace nginx-ingress || true

# Create secret for JWT token (requires nginx-repo.jwt in current directory)
echo "Creating regcred secret for image pull (JWT)..."
kubectl create secret generic regcred \
  --from-file=nginx-repo.jwt=./nginx-repo.jwt \
  --namespace=nginx-ingress --dry-run=client -o yaml | kubectl apply -f -

# Create secret for NGINX Plus license (requires nginx-repo.crt and nginx-repo.key in current directory)
echo "Creating nginx-plus-license secret..."
kubectl create secret tls nginx-plus-license \
  --cert=./nginx-repo.crt \
  --key=./nginx-repo.key \
  --namespace=nginx-ingress --dry-run=client -o yaml | kubectl apply -f -

# Download the nginx-stable/nginx-ingress Helm chart into the current directory
echo "Downloading nginx-stable/nginx-ingress Helm chart..."
helm pull nginx-stable/nginx-ingress --untar

# Download the NGINX Plus Ingress Controller image from the F5 registry using JWT
echo "Logging in to F5 registry and pulling NGINX Plus Ingress Controller image..."
docker login --username=jwt --password-stdin private-registry.nginx.com < ./nginx-repo.jwt

echo "Pulling image..."
docker pull private-registry.nginx.com/nginx-ic/nginx-plus-ingress:<version>

# Tag and push to your private registry (replace <your-private-registry> as needed)
echo "Tagging and pushing image to your private registry..."
docker tag private-registry.nginx.com/nginx-ic/nginx-plus-ingress:<version> <your-private-registry>/nginx-ic/nginx-plus-ingress:<version>
docker push <your-private-registry>/nginx-ic/nginx-plus-ingress:<version>

echo "Update values-plus.yaml to use your private registry path for controller.image.repository and correct tag."

# Install the NGINX Plus Ingress Controller using Helm and values-plus.yaml
echo "Installing NGINX Plus Ingress Controller with Helm..."
helm upgrade --install nginx-ingress nginx-stable/nginx-ingress \
  --namespace nginx-ingress \
  -f values-plus.yaml

# Wait for the ingress controller to be ready
kubectl rollout status deployment/nginx-ingress -n nginx-ingress

# Output service info
kubectl get svc -n nginx-ingress

echo "\nNGINX Ingress Controller installation complete."
echo "To test, apply the provided test-ingress.yaml after deploying a sample app."
