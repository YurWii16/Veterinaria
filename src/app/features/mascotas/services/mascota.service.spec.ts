import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MascotaService } from './mascota.service';
import { Mascota, AtencionClinica, Especie } from '../models';

describe('MascotaService', () => {
  let service: MascotaService;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    service = new MascotaService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Inicialización', () => {
    it('debe cargar datos del storage si existen', (done) => {
      service.obtenerTodas().subscribe((mascotas) => {
        expect(mascotas.length).toBeGreaterThan(0);
        done();
      });
    });

    it('debe crear datos iniciales si no existen en storage', (done) => {
      const nuevoService = new MascotaService();
      nuevoService.obtenerTodas().subscribe((mascotas) => {
        expect(mascotas.length).toBeGreaterThan(0);
        expect(mascotas[0].nombre).toBe('Firulais');
        done();
      });
    });
  });

  describe('CRUD - Create', () => {
    it('debe crear una nueva mascota', (done) => {
      const nuevaMascota = new Mascota(
        '',
        'Rex',
        Especie.CANINO,
        'Pastor Alemán',
        new Date('2021-06-15'),
        28.5
      );

      service.crear(nuevaMascota).subscribe((mascota) => {
        expect(mascota.id).toBeDefined();
        expect(mascota.nombre).toBe('Rex');
        expect(mascota.especie).toBe(Especie.CANINO);

        service.obtenerTodas().subscribe((mascotas) => {
          expect(mascotas.some((m) => m.nombre === 'Rex')).toBe(true);
          done();
        });
      });
    });

    it('debe generar IDs únicos para cada mascota', (done) => {
      const mascota1 = new Mascota(
        '',
        'Milo',
        Especie.FELINO,
        'Siamés',
        new Date('2023-01-10'),
        3.5
      );
      const mascota2 = new Mascota(
        '',
        'Luna',
        Especie.FELINO,
        'Persa',
        new Date('2023-02-20'),
        4.0
      );

      service.crear(mascota1).subscribe(() => {
        service.crear(mascota2).subscribe(() => {
          service.obtenerTodas().subscribe((mascotas) => {
            const ids = mascotas.map((m) => m.id);
            expect(new Set(ids).size).toBe(ids.length);
            done();
          });
        });
      });
    });
  });

  describe('CRUD - Read', () => {
    it('debe obtener todas las mascotas', (done) => {
      service.obtenerTodas().subscribe((mascotas) => {
        expect(Array.isArray(mascotas)).toBe(true);
        expect(mascotas.length).toBeGreaterThan(0);
        done();
      });
    });

    it('debe obtener mascota por ID', (done) => {
      service.obtenerTodas().subscribe((mascotas) => {
        const mascotaId = mascotas[0].id;

        service.obtenerPorId(mascotaId).subscribe((mascota) => {
          expect(mascota).toBeDefined();
          expect(mascota?.id).toBe(mascotaId);
          done();
        });
      });
    });

    it('debe retornar undefined si ID no existe', (done) => {
      service.obtenerPorId('id-inexistente').subscribe((mascota) => {
        expect(mascota).toBeUndefined();
        done();
      });
    });
  });

  describe('CRUD - Update', () => {
    it('debe actualizar una mascota existente', (done) => {
      service.obtenerTodas().subscribe((mascotas) => {
        const mascotaId = mascotas[0].id;

        service
          .actualizar(mascotaId, { nombre: 'FirulaisActualizado' })
          .subscribe((mascotaActualizada) => {
            expect(mascotaActualizada.nombre).toBe('FirulaisActualizado');

            service.obtenerPorId(mascotaId).subscribe((mascota) => {
              expect(mascota?.nombre).toBe('FirulaisActualizado');
              done();
            });
          });
      });
    });

    it('debe lanzar error si intenta actualizar ID inexistente', (done) => {
      service.actualizar('id-inexistente', { nombre: 'Test' }).subscribe(
        () => {
          expect.fail('No debería completar');
        },
        (error) => {
          expect(error).toBeDefined();
          done();
        }
      );
    });
  });

  describe('CRUD - Delete', () => {
    it('debe eliminar una mascota', (done) => {
      service.obtenerTodas().subscribe((mascotas) => {
        const inicial = mascotas.length;
        const mascotaId = mascotas[0].id;

        service.eliminar(mascotaId).subscribe(() => {
          service.obtenerTodas().subscribe((mascotasActualizadas) => {
            expect(mascotasActualizadas.length).toBe(inicial - 1);
            expect(
              mascotasActualizadas.some((m) => m.id === mascotaId)
            ).toBe(false);
            done();
          });
        });
      });
    });

    it('debe lanzar error si intenta eliminar ID inexistente', (done) => {
      service.eliminar('id-inexistente').subscribe(
        () => {
          expect.fail('No debería completar');
        },
        (error) => {
          expect(error).toBeDefined();
          done();
        }
      );
    });
  });

  describe('Búsqueda y Filtrado', () => {
    it('debe buscar mascotas por nombre', (done) => {
      service.buscarPorNombre('Firulais').subscribe((resultados) => {
        expect(resultados.length).toBeGreaterThan(0);
        expect(resultados[0].nombre).toContain('Firulais');
        done();
      });
    });

    it('debe retornar todas si búsqueda está vacía', (done) => {
      service.obtenerTodas().subscribe((todosTodas) => {
        service.buscarPorNombre('').subscribe((resultados) => {
          expect(resultados.length).toBe(todosTodas.length);
          done();
        });
      });
    });

    it('debe filtrar por especie', (done) => {
      service.filtrarPorEspecie(Especie.CANINO).subscribe((resultados) => {
        expect(resultados.every((m) => m.especie === Especie.CANINO)).toBe(
          true
        );
        done();
      });
    });

    it('debe filtrar por dueño', (done) => {
      service.filtrarPorDueno('Juan').subscribe((resultados) => {
        expect(
          resultados.every((m) =>
            m.duenoNombre?.toLowerCase().includes('juan')
          )
        ).toBe(true);
        done();
      });
    });

    it('debe buscar con criterios avanzados', (done) => {
      service
        .buscarAvanzada({
          especie: Especie.CANINO,
          edadMinima: 0,
          edadMaxima: 10,
        })
        .subscribe((resultados) => {
          expect(
            resultados.every(
              (m) => m.especie === Especie.CANINO && m.calcularEdad() <= 10
            )
          ).toBe(true);
          done();
        });
    });
  });

  describe('Utilidades', () => {
    it('debe contar total de mascotas', (done) => {
      service.obtenerTodas().subscribe((mascotas) => {
        service.obtenerTotal().subscribe((total) => {
          expect(total).toBe(mascotas.length);
          done();
        });
      });
    });

    it('debe obtener mascotas que necesitan revisión', (done) => {
      service.obtenerMascotasQueNecesitanRevision().subscribe((mascotas) => {
        expect(
          mascotas.every((m) => m.necesitaRevisionPorEdad())
        ).toBe(true);
        done();
      });
    });

    it('debe agregar atención clínica a mascota', (done) => {
      service.obtenerTodas().subscribe((mascotas) => {
        const mascotaId = mascotas[0].id;
        const atencionNueva = new AtencionClinica(
          'aten-1',
          new Date(),
          'Vacunación',
          'Aplicada correctamente'
        );

        service
          .agregarAtencionClinica(mascotaId, atencionNueva)
          .subscribe((mascota) => {
            expect(
              mascota.historialClinico.some(
                (a) => a.motivo === 'Vacunación'
              )
            ).toBe(true);
            done();
          });
      });
    });

    it('debe limpiar todos los datos', (done) => {
      service.limpiarDatos().subscribe(() => {
        service.obtenerTodas().subscribe((mascotas) => {
          expect(mascotas.length).toBe(0);
          done();
        });
      });
    });
  });

  describe('Persistencia en localStorage', () => {
    it('debe persistir datos en localStorage', (done) => {
      service.obtenerTodas().subscribe((mascotasInicial) => {
        const datosEnStorage = localStorage.getItem('vetvibe_mascotas');
        expect(datosEnStorage).toBeDefined();

        const mascotasGuardadas = JSON.parse(datosEnStorage!);
        expect(mascotasGuardadas.length).toBe(mascotasInicial.length);
        done();
      });
    });

    it('debe recuperar datos después de reiniciar servicio', (done) => {
      service.obtenerTodas().subscribe((mascotasInicial) => {
        const nuevoService = new MascotaService();

        nuevoService.obtenerTodas().subscribe((mascotasRecuperadas) => {
          expect(mascotasRecuperadas.length).toBe(mascotasInicial.length);
          done();
        });
      });
    });
  });
});
