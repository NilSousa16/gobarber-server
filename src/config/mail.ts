interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'nilson.sousa@n2softwares.tech',
      name: 'Nilson Rodrigues Sousa'
    }
  }
} as IMailConfig;
