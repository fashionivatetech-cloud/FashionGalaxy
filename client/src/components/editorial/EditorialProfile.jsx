import ImageLeft from './ImageLeft';
import ImageRight from './ImageRight';

/**
 * EditorialProfile — Routes to ImageLeft or ImageRight
 * based on the profile's `layout_style` field.
 * 'left'  → image on left  (Layout A)
 * 'right' → image on right (Layout B)
 * Defaults to ImageLeft if field is missing or unknown.
 */
export default function EditorialProfile({ profile }) {
  const style = profile?.layout_style ?? 'left';
  if (style === 'right') return <ImageRight profile={profile} />;
  return <ImageLeft profile={profile} />;
}
