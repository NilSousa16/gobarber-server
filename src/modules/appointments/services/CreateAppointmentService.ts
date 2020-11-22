/**
 * startOfHour - arredonda para o início da hora
 */
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable() // necessário para classes com injeção de dependência
class CreateAppointmentService {
  // Forma reduzida para criar a instância de appointmentsRepository
  // Evita a necessidade de this.appointmentsRepository = appointmentsRepository
  constructor(
    @inject('AppointmentsRepository') // injeção de dependência declarada em container
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository') // injeção de dependência declarada em container
    private notificationsRepository: INotificationsRepository,
  ) {}


  public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    // Verifica se a data é anterior a outra
    if(isBefore(appointmentDate, Date.now())){
      throw new AppError("You can't create an appointment on a past date.")
    }

    if(user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointments between 8am and 5pm');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if(findAppointmentInSameDate){
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    })

    return appointment;
  }
}

export default CreateAppointmentService;
