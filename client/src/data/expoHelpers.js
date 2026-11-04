const fallbackImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';

export function formatExpoDate(value) {
  if (!value) return 'Date to be announced';

  const dateText = value instanceof Date ? value.toISOString() : String(value);
  const datePart = dateText.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!datePart) return dateText;

  const [year, month, day] = datePart.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getExpoDateInputValue(value) {
  if (!value) return '';
  return String(value).match(/^\d{4}-\d{2}-\d{2}/)?.[0] || '';
}

export function mapExpoRecord(expo) {
  const category = expo.category?.category_name || expo.theme || 'General';

  return {
    id: expo._id,
    _id: expo._id,
    title: expo.title,
    category,
    theme: expo.theme || '',
    image: expo.bannerUrl || fallbackImage,
    date: formatExpoDate(expo.date),
    location: expo.location || 'Venue to be announced',
    city: expo.location?.split(',')[0] || 'Convention City',
    description: expo.description || '',
    organizer: expo.organizer?.name || 'EventSphere Management',
    boothCount: expo.boothCount ?? 0
  };
}
