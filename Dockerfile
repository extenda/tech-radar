FROM node:20-alpine

ENV PUBLIC_HTML /var/www

EXPOSE 8080

COPY build /var/www
COPY server/dist /opt/tech-radar

ENTRYPOINT ["/usr/local/bin/node"]
CMD ["/opt/tech-radar/index.js"]
