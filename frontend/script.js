// Capture trip planning form submission, prevent reload, and log values
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.trip-form');
  if (!form) return;

  // Create or get an error message element placed under the form
  const getErrorEl = () => {
    let el = document.getElementById('trip-form-error');
    if (!el) {
      el = document.createElement('p');
      el.id = 'trip-form-error';
      el.setAttribute('role', 'alert');
      el.setAttribute('aria-live', 'polite');
      el.style.color = '#b91c1c'; // red-700
      el.style.marginTop = '12px';
      el.style.fontWeight = '600';
      form.insertAdjacentElement('afterend', el);
    }
    return el;
  };

  const clearError = () => {
    const el = document.getElementById('trip-form-error');
    if (el) el.textContent = '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const destination = /** @type {HTMLInputElement|null} */ (document.getElementById('destination'));
    const budget = /** @type {HTMLInputElement|null} */ (document.getElementById('budget'));
    const startDate = /** @type {HTMLInputElement|null} */ (document.getElementById('start_date'));
    const endDate = /** @type {HTMLInputElement|null} */ (document.getElementById('end_date'));

    const data = {
      destination: destination?.value.trim() || '',
      budget: (budget?.value ?? '').trim(),
      startDate: (startDate?.value ?? '').trim(),
      endDate: (endDate?.value ?? '').trim(),
    };

    // Validate: all fields must be non-empty
    const emptyField = Object.entries(data).find(([_, v]) => v === '');
    if (emptyField) {
      const errorEl = getErrorEl();
      errorEl.textContent = 'Please fill in destination, budget, start date, and end date.';
      // Focus the first empty field for convenience
      const [key] = emptyField;
      const idMap = { destination: 'destination', budget: 'budget', startDate: 'start_date', endDate: 'end_date' };
      const firstEmpty = document.getElementById(idMap[key]);
      if (firstEmpty && 'focus' in firstEmpty) firstEmpty.focus();
      return; // do not proceed
    }

    clearError();
    console.log('Trip form submitted:', data);
  });
});
