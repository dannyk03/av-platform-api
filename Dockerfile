ARG NODE_IMAGE_TAG=18-alpine

###############################
# BUILD FOR LOCAL DEVELOPMENT #
###############################

FROM node:$NODE_IMAGE_TAG As development

# bcrycp package requires python (performance and security)
# RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
# RUN npm install --quiet node-gyp -g

WORKDIR /usr/src/app
ARG JFROG_AUTH_TOKEN

EXPOSE 8080/tcp

# Copy application dependency manifests to the container image.
# Copying this first prevents re-running yarn install on every code change.
COPY --chown=node:node package.json yarn.lock .npmrc ./


# bcrycp package requires node-gyp + python (performance and security)
# https://github.com/nodejs/docker-node/issues/384#issuecomment-305208112
# RUN apk --no-cache add --virtual native-deps \
#   g++ gcc libgcc libstdc++ linux-headers make python && \
#   yarn install --quiet node-gyp -g &&\
#   yarn install --immutable && \
#   apk del native-deps

# Install app dependencies using yarn
RUN yarn install --immutable

# Bundle app source
COPY --chown=node:node . .

# Prevent 'error: An unexpected error occurred: "Failed to replace env in config: ${JFROG_AUTH_TOKEN}".' in runtime
RUN rm -f .npmrc

# Use the node user from the image (instead of the root user)
USER node


########################
# BUILD FOR PRODUCTION #
########################

FROM node:$NODE_IMAGE_TAG As build

WORKDIR /usr/src/app
ARG JFROG_AUTH_TOKEN

# bcrycp package requires python (performance and security)
# RUN apt-get update || : && apt-get install python -y

# Copy application dependency manifests to the container image.
COPY --chown=node:node package.json yarn.lock .npmrc ./

# In order to run `yarn build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `yarn install --immutable` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN yarn build

# Set NODE_ENV environment variable
ENV NODE_ENV=production

# Only production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN yarn install && yarn cache clean --all

# Prevent 'error: An unexpected error occurred: "Failed to replace env in config: ${JFROG_AUTH_TOKEN}".' in runtime
RUN rm -f .npmrc

# Use the node user from the image (instead of the root user)
USER node


##############
# PRODUCTION #
##############

FROM node:${NODE_IMAGE_TAG} As production

# Use the node user from the image (instead of the root user)
USER node

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]