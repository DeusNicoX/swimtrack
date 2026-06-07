import { expect, test } from '@playwright/test';

const password = 'Password123!';
const apiBaseUrl = process.env.PLAYWRIGHT_API_URL || 'http://localhost:3000';

function uniqueId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function registerTrainer(request, runId) {
  const email = `e2e-trainer-${runId}@test.com`;
  const response = await request.post(`${apiBaseUrl}/api/auth/register`, {
    data: {
      contact_info: `${email} / 3001234567`,
      email,
      experience_years: 6,
      full_name: 'Trainer E2E',
      password,
      role: 'trainer',
      specialty: 'Tecnica',
    },
  });

  expect(response.ok()).toBeTruthy();

  return {
    email,
    ...(await response.json()),
  };
}

async function login(page, email) {
  await page.goto('/login');
  await page.getByLabel('Correo electrónico').fill(email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
}

async function publishService(page, serviceTitle) {
  await page.getByLabel('Nombre del servicio').fill(serviceTitle);
  await page.getByLabel('Tipo de entrenamiento').fill('Natacion tecnica');
  await page
    .getByLabel('Descripción')
    .fill('Servicio publicado durante prueba E2E');
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await page.getByLabel('Modalidad').fill('Individual');
  await page.getByLabel('Ubicación').fill('Piscina E2E');
  await page.getByLabel('Horario').fill('Viernes 6 p.m.');
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await expect(page.getByLabel('Resumen del servicio')).toContainText(
    serviceTitle,
  );
  await page.getByRole('button', { name: 'Finalizar' }).click();
  await expect(page.getByText('Servicio publicado correctamente.')).toBeVisible();
}

test.describe.serial('SwimTrack E2E', () => {
  test('registers a client user and redirects to services', async ({ page }) => {
    const runId = uniqueId();
    const email = `e2e-client-${runId}@test.com`;

    await page.goto('/registro');
    await page.getByLabel('Nombre completo').fill('Client E2E');
    await page.getByLabel('Correo electrónico').fill(email);
    await page.getByLabel('Contraseña', { exact: true }).fill(password);
    await page.getByLabel('Confirmar contraseña').fill(password);
    await page.getByRole('button', { name: 'Crear cuenta' }).click();

    await expect(page).toHaveURL(/\/servicios$/);
    await expect(
      page.getByRole('heading', { name: 'Buscar servicios de natacion' }),
    ).toBeVisible();
  });

  test('logs in a trainer and allows access to publish service', async ({
    page,
    request,
  }) => {
    const runId = uniqueId();
    const trainer = await registerTrainer(request, runId);

    await login(page, trainer.email);

    await expect(page).toHaveURL(/\/servicios\/publicar$/);
    await expect(
      page.getByRole('heading', { name: 'Publicar nuevo servicio' }),
    ).toBeVisible();
    await expect(page.getByText('Trainer E2E')).toBeVisible();
  });

  test('trainer publishes a service and sees it in services list', async ({
    page,
    request,
  }) => {
    const runId = uniqueId();
    const trainer = await registerTrainer(request, runId);
    const serviceTitle = `Servicio E2E ${runId}`;

    await login(page, trainer.email);
    await expect(page).toHaveURL(/\/servicios\/publicar$/);

    await publishService(page, serviceTitle);
    await page.getByRole('link', { name: 'Servicios' }).click();

    await expect(page).toHaveURL(/\/servicios$/);
    await expect(page.getByText(serviceTitle)).toBeVisible();
    await expect(page.getByText('Piscina E2E')).toBeVisible();
  });

  test('search filters services by title', async ({ page, request }) => {
    const runId = uniqueId();
    const trainer = await registerTrainer(request, runId);
    const serviceTitle = `Busqueda E2E ${runId}`;

    const createResponse = await request.post(
      `${apiBaseUrl}/api/services`,
      {
        data: {
          description: 'Servicio para validar busqueda E2E',
          location: 'Piscina Busqueda',
          modality: 'Individual',
          schedule: 'Sabado 8 a.m.',
          title: serviceTitle,
        },
        headers: {
          Authorization: `Bearer ${trainer.token}`,
        },
      },
    );

    expect(createResponse.ok()).toBeTruthy();

    await page.goto('/servicios');
    await page.getByRole('searchbox', { name: 'Buscar servicios' }).fill(
      serviceTitle,
    );

    await expect(page.getByText('1 servicio encontrado')).toBeVisible();
    await expect(page.getByText(serviceTitle)).toBeVisible();
  });
});
