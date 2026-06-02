export const CONSUME_UNPROCESSED = `
        WITH locked AS (
        SELECT id
        FROM outbox
        WHERE published = false
        AND ( 
          processing = false
            OR (
                processing = true
                AND processing_started_at < NOW() - INTERVAL '5 minutes'
              )
            )
        AND (next_attempt_at IS NULL OR next_attempt_at <= NOW())
        ORDER BY "occurredAt" ASC
        LIMIT $1
        FOR UPDATE SKIP LOCKED
        )
        UPDATE outbox o
        SET processing = true,
        processing_started_at = NOW()
        FROM locked
        WHERE o.id = locked.id
        RETURNING o.*
        `;
