import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';


class AppointmentsRepository implements IAppointmentsRepository{
  private ormRepository: Repository<Appointment>;

  constructor() {
    // Criação do repositório
    this.ormRepository = getRepository(Appointment);
  }


  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date }, // date : date - date = date
    })

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    // Para converter de 4 para 04 por exemplo
    // Se a string não tiver 2 digito preenche a esquerda com 0
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        // Raw - passado direto para o postgres sem conversões
        // dateFieldName - nome do campo date dentro do postgres
        // to_char - convertendo para string
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        )
      }
    })

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    // Para converter de 4 para 04 por exemplo
    // Se a string não tiver 2 digito preenche a esquerda com 0
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        // Raw - passado direto para o postgres sem conversões
        // dateFieldName - nome do campo date dentro do postgres
        // to_char - convertendo para string
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        )
      }
    })

    return appointments;
  }

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }

}

export default AppointmentsRepository;
