ARG NODE_IMAGE_TAG=18-alpine

###############################
# BUILD FOR LOCAL DEVELOPMENT #
###############################

FROM node:$NODE_IMAGE_TAG As development

# Private packages token
ARG JFROG_AUTH_TOKEN

EXPOSE ${APP_PORT}

WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# Copying this first prevents re-running yarn install on every code change.
COPY --chown=node:node package.json yarn.lock .npmrc ./

# Install app dependencies using yarn
# bcrycp package requires node-gyp rebuild (performance and security)
# https://github.com/nodejs/docker-node/issues/384#issuecomment-305208112
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python3 && \
  yarn install --immutable && \
  apk del native-deps

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

# Set NODE_ENV environment variable
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Private packages token
ARG JFROG_AUTH_TOKEN

WORKDIR /usr/src/app

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

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./

# TODO enable this configuration after we have efficient logging mechanism (Datadog etc...)(after removing Winston/Morgan)
# Use the node user from the image (instead of the root user)
USER node

# Start the server using the production build
CMD [ "yarn", "start:prod" ]