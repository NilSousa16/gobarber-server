import { injectable, inject } from 'tsyringe';
// Retorna quantidade de dias em um mês
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentRepository from '../repositories/IAppointmentsRepository';

interface IRequest{
  provider_id: string;
  month: number;
  year:number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({ provider_id, year, month }: IRequest): Promise<IResponse> {
    // retorna agendamentos do mês
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      year,
      month,
    });

    // Dias do mês
    const numberOfDaysInMonth = getDaysInMonth(
      new Date(year, month - 1)
    );

    // Criando um array
    const eachDayArray = Array.from(
      // tamanho do array
      { length: numberOfDaysInMonth },
      // cada posição terá um numero [1, 2, 3, 4, 5, ...]
      (_, index) => index + 1,
    );

    // verifica os agendamentos de um dia específico
    const availability = eachDayArray.map(day => {
      // conta quantos agendamentos há para cada dia
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
