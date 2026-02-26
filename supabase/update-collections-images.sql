-- Update Collections in Focus images with correct full paths
UPDATE site_content 
SET content_value = 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Cordia Bag/Cordia Bag - Purple/02-04-2026--paulina06371.jpg' 
WHERE section = 'collections_focus' AND content_key = 'collection_1_image';

UPDATE site_content 
SET content_value = 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha wallet ( clutch) /LEKHA WALLET - Mocha Tan/09-10-2025--livia00932-Photoroom.png' 
WHERE section = 'collections_focus' AND content_key = 'collection_2_image';

UPDATE site_content 
SET content_value = 'https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/Halo Mini/Halo Mini - Green/02-04-2026--paulina05791.jpg' 
WHERE section = 'collections_focus' AND content_key = 'collection_3_image';

-- Verify the updates
SELECT section, content_key, content_value 
FROM site_content 
WHERE section = 'collections_focus' AND content_key LIKE '%image%';