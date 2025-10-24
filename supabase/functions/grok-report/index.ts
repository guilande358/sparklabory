import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { project } = await req.json();
    const grokApiKey = Deno.env.get('GROK_API_KEY');

    if (!grokApiKey) {
      throw new Error('GROK_API_KEY not configured');
    }

    console.log('Generating report for project:', project.title);

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are a scientific report generator. Create a comprehensive research report with proper sections: Introduction, Methodology, Results, Discussion, and Conclusion.'
          },
          {
            role: 'user',
            content: `Generate a scientific report for this project:

Title: ${project.title}
Category: ${project.category}
Hypothesis: ${project.hypothesis || 'Not provided'}
Methodology: ${project.methodology || 'Not provided'}
Results: ${project.results || 'Not provided'}

Create a well-structured report with all standard sections.`
          }
        ],
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', response.status, errorText);
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    const report = data.choices[0].message.content;

    console.log('Report generated successfully');

    return new Response(
      JSON.stringify({ report }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in grok-report function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
