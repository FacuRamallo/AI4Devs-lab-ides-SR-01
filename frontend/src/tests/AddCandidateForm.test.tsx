import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AddCandidateForm from '../pages/AddCandidateForm';
import { addCandidate, uploadCandidateCv } from '../services/candidateService';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import axiosInstance from '../services/axiosInstance';

jest.mock('../services/candidateService');
jest.mock('../services/axiosInstance');

const mockAddCandidate = addCandidate as jest.Mock;
const mockUploadCandidateCv = uploadCandidateCv as jest.Mock;

describe('AddCandidateForm', () => {
  beforeEach(() => {
    mockAddCandidate.mockReset();
    mockUploadCandidateCv.mockReset();
  });

  it('renders the form fields correctly', () => {

    render(<AddCandidateForm />);    

    expect(screen.getByLabelText('Nombre del candidato')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellidos del candidato')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico del candidato')).toBeInTheDocument();
    expect(screen.getByLabelText('Número de teléfono del candidato')).toBeInTheDocument();
    expect(screen.getByLabelText('Dirección del candidato')).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    mockAddCandidate.mockResolvedValueOnce({ id: '123', status: 201 });
    mockUploadCandidateCv.mockResolvedValueOnce({ ok: true, url: 'http://example.com/cv.pdf'});
    mockAddCandidate.mockResolvedValueOnce({ id: '123', status: 201 });

    render(<AddCandidateForm />);   

    act(() => {
      userEvent.type(screen.getByLabelText('Nombre del candidato').querySelector('input[name="firstName"]')!, 'John');
      userEvent.type(screen.getByLabelText('Apellidos del candidato').querySelector('input[name="lastName"]')!, 'Doe');
      userEvent.type(screen.getByLabelText('Correo electrónico del candidato').querySelector('input[name="email"]')!, 'john.doe@example.com');
      userEvent.type(screen.getByLabelText('Número de teléfono del candidato').querySelector('input[name="phone"]')!, '1234567890');
      userEvent.type(screen.getByLabelText('Dirección del candidato').querySelector('input[name="address"]')!, '123 Main St');
      const fileInput = screen.getByLabelText('Seleccionar archivo de CV').querySelector('input[type="file"]') as HTMLElement;
      const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
      userEvent.upload(fileInput, file);
      userEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre del candidato').querySelector('input[name="firstName"]')).toHaveValue('John');
      expect(screen.getByLabelText('Apellidos del candidato').querySelector('input[name="lastName"]')).toHaveValue('Doe');
      expect(screen.getByLabelText('Correo electrónico del candidato').querySelector('input[name="email"]')).toHaveValue('john.doe@example.com');
      expect(screen.getByLabelText('Número de teléfono del candidato').querySelector('input[name="phone"]')).toHaveValue('1234567890');
      expect(screen.getByLabelText('Dirección del candidato').querySelector('input[name="address"]')).toHaveValue('123 Main St');
    });

    await waitFor(() => {
      expect(mockAddCandidate).toHaveBeenCalledTimes(2);
      expect(mockUploadCandidateCv).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Candidato añadido con éxito')).toBeInTheDocument();
    });
  });

  it('shows an error message on submission failure', async () => {
    mockAddCandidate.mockRejectedValueOnce(new Error('Failed to add candidate'));

    render(<AddCandidateForm />);

    act(() => {
      userEvent.type(screen.getByLabelText('Nombre del candidato').querySelector('input[name="firstName"]')!, 'John');
      userEvent.type(screen.getByLabelText('Apellidos del candidato').querySelector('input[name="lastName"]')!, 'Doe');
      userEvent.type(screen.getByLabelText('Correo electrónico del candidato').querySelector('input[name="email"]')!, 'john.doe@example.com');
      userEvent.type(screen.getByLabelText('Número de teléfono del candidato').querySelector('input[name="phone"]')!, '1234567890');
      userEvent.type(screen.getByLabelText('Dirección del candidato').querySelector('input[name="address"]')!, '123 Main St');
      const fileInput = screen.getByLabelText('Seleccionar archivo de CV').querySelector('input[type="file"]') as HTMLElement;
      const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
      userEvent.upload(fileInput, file);

      userEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Error al añadir candidato')).toBeInTheDocument();
    });
  });

  it('shows an error message when the CV upload fails', async () => {
    mockAddCandidate.mockResolvedValueOnce({ id: '123', status: 201 });
    mockUploadCandidateCv.mockRejectedValueOnce(new Error('Failed to upload CV'));

    render(<AddCandidateForm />);

    act(() => {
      userEvent.type(screen.getByLabelText('Nombre del candidato').querySelector('input[name="firstName"]')!, 'John');
      userEvent.type(screen.getByLabelText('Apellidos del candidato').querySelector('input[name="lastName"]')!, 'Doe');
      userEvent.type(screen.getByLabelText('Correo electrónico del candidato').querySelector('input[name="email"]')!, 'john.doe@example.com');
      userEvent.type(screen.getByLabelText('Número de teléfono del candidato').querySelector('input[name="phone"]')!, '1234567890');
      userEvent.type(screen.getByLabelText('Dirección del candidato').querySelector('input[name="address"]')!, '123 Main St');

      const fileInput = screen.getByLabelText('Seleccionar archivo de CV').querySelector('input[type="file"]') as HTMLElement;
      const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
      userEvent.upload(fileInput, file);

      userEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Error al subir el CV')).toBeInTheDocument();
    });
  });

  it('shows an error message when no CV is uploaded', async () => {
    mockAddCandidate.mockResolvedValueOnce({ id: '123', status: 201 });
    render(<AddCandidateForm />);

    act(() => {
      userEvent.type(screen.getByLabelText('Nombre del candidato').querySelector('input[name="firstName"]')!, 'John');
      userEvent.type(screen.getByLabelText('Apellidos del candidato').querySelector('input[name="lastName"]')!, 'Doe');
      userEvent.type(screen.getByLabelText('Correo electrónico del candidato').querySelector('input[name="email"]')!, 'john.doe@example.com');
      userEvent.type(screen.getByLabelText('Número de teléfono del candidato').querySelector('input[name="phone"]')!, '1234567890');
      userEvent.type(screen.getByLabelText('Dirección del candidato').querySelector('input[name="address"]')!, '123 Main St');
      userEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Es necesario subir su Cv')).toBeInTheDocument();
    });
  });
});
