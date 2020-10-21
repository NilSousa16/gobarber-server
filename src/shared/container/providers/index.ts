import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/IStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider> (
  'StorageProvider',
  DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider> (
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

// Realizado dessa forma para executar o construtor da classe (Ainda é singleton)
container.registerInstance<IMailProvider> (
  'MailProvider',
  container.resolve(EtherealMailProvider),
  // new EtherealMailProvider(),
);
