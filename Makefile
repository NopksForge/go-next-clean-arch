# Docker commands for backend
.PHONY: be-docker-up be-docker-down

be-docker-up:
	docker compose -f ./backend/docker-compose.local.yaml up --build --wait

be-docker-down:
	docker compose -f ./backend/docker-compose.local.yaml down --remove-orphans > /dev/null 2>&1

# Docker commands for frontend
.PHONY: fe-docker-up fe-docker-down

fe-docker-up:
	docker compose -f ./frontend/docker-compose.local.yaml up --build --wait

fe-docker-down:
	docker compose -f ./frontend/docker-compose.local.yaml down --remove-orphans > /dev/null 2>&1

# Combined docker commands
.PHONY: docker-up docker-down docker-restart docker-clean docker-fresh

docker-up: be-docker-up fe-docker-up

docker-down: be-docker-down fe-docker-down

docker-restart: docker-down docker-up

docker-clean:
	docker compose -f ./backend/docker-compose.local.yaml down -v --remove-orphans
	docker compose -f ./frontend/docker-compose.local.yaml down -v --remove-orphans
	docker system prune -f

docker-fresh: docker-clean docker-up