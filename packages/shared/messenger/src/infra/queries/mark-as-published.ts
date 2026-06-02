export const MARK_AS_PUBLISHED = `
        UPDATE outbox
        SET processing = false,
        published = true,
        published_at = $1
        WHERE id = ANY($2)
`;
