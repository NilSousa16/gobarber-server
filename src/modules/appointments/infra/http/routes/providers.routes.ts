import { Router } from 'express';

 import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

 import ProvidersController from '../controllers/ProvidersController';
 import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
 import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

//aplicação da middleware
providersRouter.use(ensureAuthenticated);

// middleware para rota especifica
// appointmentsRouter.get('/', ensureAuthenticated ,async (request, response) => {
// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// })

providersRouter.get('/', providersController.index);

providersRouter.get('/:provider_id/month-availability', providerMonthAvailabilityController.index);

providersRouter.get('/:provider_id/day-availability', providerDayAvailabilityController.index);

export default providersRouter;
