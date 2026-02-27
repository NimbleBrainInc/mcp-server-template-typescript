# MCPB bundle configuration
BUNDLE_NAME = YOUR_SERVER_NAME

# Single source of truth: manifest.json
VERSION := $(shell jq -r '.version' manifest.json)

.PHONY: help install build format format-check lint typecheck test clean run check all sync bump bundle

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm ci

build: ## Build TypeScript
	npm run build

format: ## Format code with biome
	npm run format

format-check: ## Check code formatting
	npm run format:check

lint: ## Lint code with biome
	npm run lint

typecheck: ## Type check with tsc
	npm run typecheck

test: ## Run tests with vitest
	npm run test

clean: ## Clean build artifacts
	rm -rf build node_modules *.mcpb

run: build ## Run the MCP server in stdio mode
	node build/index.js --stdio

check: format-check typecheck test ## Run all checks

all: clean install build check ## Clean, install, build, and check

sync: ## Sync VERSION from manifest.json → package.json, server.json, src/constants.ts
	@echo "Syncing VERSION=$(VERSION)..."
	@jq --arg v "$(VERSION)" '.version = $$v' package.json > package.tmp.json && mv package.tmp.json package.json
	@jq --arg v "$(VERSION)" '.version = $$v | .packages[0].version = $$v' server.json > server.tmp.json && mv server.tmp.json server.json
	@sed -i '' 's/export const VERSION = ".*"/export const VERSION = "$(VERSION)"/' src/constants.ts
	@echo "Done — VERSION=$(VERSION) synced to package.json, server.json, src/constants.ts"

bump: ## Bump version (usage: make bump VERSION=0.2.0)
ifndef VERSION
	$(error VERSION is required. Usage: make bump VERSION=0.2.0)
endif
	@jq --arg v "$(VERSION)" '.version = $$v' manifest.json > manifest.tmp.json && mv manifest.tmp.json manifest.json
	@$(MAKE) --no-print-directory sync

bundle: build ## Build MCPB bundle locally
	npm prune --omit=dev
	npx -y @anthropic-ai/mcpb pack
	npm install

# Shortcuts
fmt: format
t: test
l: lint
tc: typecheck
