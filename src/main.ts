import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as nunjucks from 'nunjucks';
import * as sassMiddleware from 'node-sass-middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  //app.setBaseViewsDir(join(__dirname, '..', 'views'));
  //app.setViewEngine('njk');
  const env = nunjucks.configure(
    [join(__dirname, 'views'), 'node_modules/govuk-frontend'],
    {
      autoescape: true,
      watch: true,
      noCache: process.env.NODE_ENV === "local" ? true : false,
      express: app
    }
  );
  app.engine('njk', env.render);
  app.setViewEngine('njk');

  app.use(
    sassMiddleware({
      src: join(__dirname, 'scss'),
      dest: join(__dirname, '..', 'public'),
      debug: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
