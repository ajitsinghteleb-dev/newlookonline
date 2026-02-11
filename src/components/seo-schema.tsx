import { decideAndGenerateSchema } from '@/ai/flows/implement-dynamic-schema-markup';
import type { ContentItem } from '@/lib/types';

export async function SeoSchema({ item }: { item: ContentItem }) {
  try {
    const schemaData = await decideAndGenerateSchema({
      contentType: item.type,
      content: item.content,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      region: item.region,
    });

    if (!schemaData || !schemaData.schema) {
      return null;
    }

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData.schema, null, 2) }}
      />
    );
  } catch (error) {
    console.error("Failed to generate schema:", error);
    return null;
  }
}
