FROM node:13-alpine

ENV PUBLIC_HTML /var/www

EXPOSE 8080

COPY build /var/www
COPY server/dist /opt/tech-radar

CMD ["/usr/local/bin/node", "/opt/tech-radar/index.js"]
