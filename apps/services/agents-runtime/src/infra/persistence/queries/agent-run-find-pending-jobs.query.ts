export const FIND_PENDING_JOBS_QUERY = `
      WITH selected_jobs AS (
        SELECT id
        FROM internal_agent_run_job
        WHERE status = 'pending'
          AND available_at <= NOW()
          AND attempts < max_attempts
        ORDER BY created_at ASC
        LIMIT 10
        FOR UPDATE SKIP LOCKED
      )
      UPDATE internal_agent_run_job AS job
      SET
        status = 'processing',
        updated_at = NOW()
      FROM selected_jobs
      WHERE job.id = selected_jobs.id
      RETURNING job.*;
      `;
