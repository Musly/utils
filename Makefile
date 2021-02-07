wipe:
		find . -name "*error.log" -type f -delete;
		find . -name "*debug.log" -type f -delete;
		find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
		find . -name "dist" -type d -prune -exec rm -rf '{}' +
		find . -name ".cache-loader" -type d -prune -exec rm -rf '{}' +
		find . -name "coverage" -type d -prune -exec rm -rf '{}' +

clean:
		make wipe;
		yarn install --frozen-lockfile;

refresh:
		make wipe;
		rm -f yarn.lock;
		yarn install;

patch:
		yarn version --patch;
		git push;
		git push --tags;
		npm publish;

minor:
		yarn version --minor;
		git push;
		git push --tags;
		npm publish;

major:
		yarn version;
		git push;
		git push --tags;
		npm publish;
