docker-build:
	docker build -t dewdrop-server-node .

docker-test: docker-build
	 docker run --rm \
		 -e SERVER_NAME="http://docker.knban.com" \
		 -e DEWDROP_USER="keyvan" \
		 -e DEWDROP_PASS="secret" \
		 -v /var/dewdrop:/data \
		 -p 44444:3000 \
		 dewdrop-server-node

