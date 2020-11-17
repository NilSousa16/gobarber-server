import { injectable, inject } from 'tsyringe';
// getHours - Retorna o horário de uma data
// isAfter - Verifica se a data já passou
import { getHours, isAfter } from 'date-fns';

import IAppointmentRepository from '../repositories/IAppointmentsRepository';

interface IRequest{
  provider_id: string;
  day: number;
  month: number;
  year:number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({ provider_id, year, month, day }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      year,
      month,
      day,
    })

    const hourStart = 8;

    // monta array com os horários
    // _ - simboliza o valor
    const eachHourArray = Array.from({ length: 10 }, (_, index) => index + hourStart)

    // Data e hora atual
    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      // Data e hora do agendamento
      const compareDate = new Date(year, month - 1, day,hour);

      return {
        hour,
        // realiza a lógica booleana para gerar resultado do availabe
        // isAfter - verifica se a compareDate e depois de currentDate
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      }
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
