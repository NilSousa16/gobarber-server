import { Router } from 'express';
// Para validação no back-end
import { celebrate, Segments, Joi } from 'celebrate';

 import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

 import AppointmentsController from '../controllers/AppointmentsController';

 import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

//aplicação da middleware
appointmentsRouter.use(ensureAuthenticated);

// middleware para rota especifica
// appointmentsRouter.get('/', ensureAuthenticated ,async (request, response) => {
// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// })

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      // Provider_id deve ser uma string uuid e obrigatório
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create
);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
