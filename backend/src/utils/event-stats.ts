export async function refreshEventStats(strapi: any, eventDocumentId?: string) {
  if (!eventDocumentId) return;

  const reviews = await strapi.documents('api::review.review').findMany({
    filters: { event: { documentId: eventDocumentId } },
    fields: ['rating'],
    limit: 1000,
  });
  const avg = reviews.length
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  const rsvp_count = await strapi.documents('api::rsvp.rsvp').count({
    filters: { event: { documentId: eventDocumentId }, status: 'confirmed' },
  });

  await strapi.documents('api::event.event').update({
    documentId: eventDocumentId,
    data: { avg_rating: Math.round(avg * 10) / 10, rsvp_count },
  });
}

// Resolve the parent event's documentId from a lifecycle event (create/update carry the result,
// delete only carries the row id).
export async function eventIdFromLifecycle(strapi: any, uid: string, event: any) {
  const id = event.result?.id ?? event.params?.where?.id;
  if (!id) return undefined;
  const row = await strapi.db.query(uid).findOne({ where: { id }, populate: ['event'] });
  return row?.event?.documentId;
}
