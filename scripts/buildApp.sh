#!/bin/bash
tar --exclude='.git' --exclude=webapp.tar.gz --exclude='.github' --exclude='.vscode' --exclude='node_modules' --exclude="package-lock.json" --exclude=".env" -zcvf webapp.tar.gz .