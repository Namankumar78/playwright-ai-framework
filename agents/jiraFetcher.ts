import dotenv from 'dotenv';
dotenv.config();

export async function fetchJiraTicket(jiraId: string) {
  const JIRA_BASE_URL = process.env.JIRA_BASE_URL!;
  const JIRA_EMAIL = process.env.JIRA_EMAIL!;
  const JIRA_TOKEN = process.env.JIRA_API_TOKEN!;

  const url = `${JIRA_BASE_URL}/rest/api/3/issue/${jiraId}`;

  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Jira ticket: ${jiraId}`);
  }

  const data = await response.json();

  return {
    key: data.key,
    summary: data.fields.summary,
    description: data.fields.description,
    priority: data.fields.priority?.name,
    status: data.fields.status?.name,
    acceptanceCriteria: data.fields.customfield_XXXXX || [],
  };
}
