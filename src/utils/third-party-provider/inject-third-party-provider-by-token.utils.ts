import { Inject, Optional } from '@nestjs/common';

export function InjectThirdPartyProviderByToken(token: string) {
  return (target: object, key: string | symbol, index?: number) => {
    Inject(token)(target, key, index);

    if (process.env.MIGRATION === 'true') {
      // When custom (JS) migrations running, there is no access to env credential variables.
      // Therefore at the stage of the migrations, all third-party providers are uninitialized.
      Optional()(target, key, index);
    }
  };
}
