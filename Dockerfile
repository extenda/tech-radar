FROM node:13-alpine

ENV PUBLIC_HTML /var/www

EXPOSE 8080

COPY --from=gcr.io/berglas/berglas:0.5.2 /bin/berglas /bin/berglas

COPY build /var/www
COPY server/dist /opt/tech-radar

CMD ["/bin/berglas", "exec", "--", "/usr/local/bin/node", "/opt/tech-radar/index.js"]
