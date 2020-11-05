import { Router } from 'express';

 import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

 import ProvidersController from '../controllers/ProvidersController';

const providersRouter = Router();
const providersController = new ProvidersController();

//aplicação da middleware
providersRouter.use(ensureAuthenticated);

// middleware para rota especifica
// appointmentsRouter.get('/', ensureAuthenticated ,async (request, response) => {
// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// })

providersRouter.get('/', providersController.index);

export default providersRouter;
