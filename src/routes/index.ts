import { Router } from 'express';

import appointmentRouter from './appointments.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();

/**
 * Toda rota iniciada por "/appointments" será
 * repassada para "appointmentRouter"
 */
routes.use('/appointments', appointmentRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
