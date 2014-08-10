dewdrop-server-node
===================

[![NPM](https://nodei.co/npm/dewdrop-server-node.png?mini=true)](https://nodei.co/npm/dewdrop-server-node/)

I got tired of hitting the CloudApp limit, and I [suck at deploying PHP apps](https://github.com/dewdrop-org/Server-PHP/issues/1) so I rewrote [DewDrop](http://dewdrop.dangelov.com/)'s [php server](https://github.com/dewdrop-org/Server-PHP) in Node.js

Get the clients here http://dewdrop.dangelov.com/ or if you're on Mac OS X, you can `brew cask install dewdrop`

## Deploy with Docker

Pull the image `docker pull dewdrop-server-node`

Create and run the container

```
docker run --name dewdrop-server \
  -e SERVER_NAME="http://foo.bar.baz" \
  -e DEWDROP_USER="you" \
  -e DEWDROP_PASS="secret" \
  -v /where/to/store/data:/data \
  -p 44444:3000 
  dewdrop-server-node
```

note: this is unrelated to https://github.com/keyvanfatehi/dew
