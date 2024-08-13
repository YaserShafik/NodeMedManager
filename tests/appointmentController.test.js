const { getAppointment } = require('../controllers/appointmentController');
const Appointment = require('../models/Appointment');

// Mock de los modelos de Mongoose
jest.mock('../models/Appointment');

describe('Appointment Controller - getAppointment', () => {
  let req, res, mockExec;

  beforeEach(() => {
    req = {
      params: { id: 'appointmentId' },
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Combinamos populate y exec en un solo mock
    mockExec = jest.fn().mockResolvedValue({
      _id: 'appointmentId',
      patient: { _id: 'patientId', name: 'John Doe' },
      doctor: { _id: 'doctorId', name: 'Dr. Smith' },
      date: '2024-08-10T14:00:00.000Z',
      reason: 'Routine check-up'
    });

    Appointment.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: mockExec,
    });
  });

  it('should return an appointment', async () => {
    await getAppointment(req, res);

    expect(Appointment.findById).toHaveBeenCalledWith(req.params.id);
    expect(mockExec).toHaveBeenCalled(); // Verifica que se ejecuta la consulta
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'appointmentId',
      patient: { _id: 'patientId', name: 'John Doe' },
      doctor: { _id: 'doctorId', name: 'Dr. Smith' },
      date: '2024-08-10T14:00:00.000Z',
      reason: 'Routine check-up'
    });
  });

  it('should return 404 if appointment is not found', async () => {
    // Simula no encontrar la cita
    mockExec.mockResolvedValueOnce(null);

    await getAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Appointment not found');
  });

  it('should return 500 if an error occurs', async () => {
    // Simula un error
    mockExec.mockRejectedValueOnce(new Error('Database error'));

    await getAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server error');
  });
});
