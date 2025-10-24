# Makefile

.PHONY: all clean install test

all: install test

install:
    pip install -r requirements.txt
    npm install

test:
    pytest tests/unit
    pytest tests/integration

clean:
    find . -type d -name '__pycache__' -exec rm -r {} +
    find . -type f -name '*.pyc' -exec rm -f {} +
    rm -rf node_modules
    rm -f package-lock.json