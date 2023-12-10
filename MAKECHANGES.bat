@echo off
rem Build the Docker image
docker build -t wiljam/frontend:latest .

rem Push the Docker image to Docker Hub (or your preferred registry)
docker push wiljam/frontend:latest

rem Apply the Kubernetes deployment and service
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl rollout restart deployment frontend

echo Deployment completed, starting port-forward...

:portforward
echo Starting port-forward...
kubectl port-forward service/frontend 3000:3000

rem Check the exit code of the port-forwarding command
if %errorlevel% neq 0 (
    echo Port-forwarding failed. Retrying in 3 seconds...
    timeout /nobreak /t 3 > nul
    goto portforward
)

echo Port-forwarding successful.
