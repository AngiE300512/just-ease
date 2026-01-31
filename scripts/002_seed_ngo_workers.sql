-- Seed NGO workers for testing
-- In production, these would be added via an admin interface

INSERT INTO public.ngo_workers (name, email, organization_name, password_hash, is_active)
VALUES 
  ('Priya Sharma', 'priya@helpinghands.org', 'Helping Hands Foundation', 'demo123', true),
  ('Rajesh Kumar', 'rajesh@disability-aid.org', 'Disability Aid Network', 'demo123', true),
  ('Lakshmi Devi', 'lakshmi@tnsocial.org', 'TN Social Welfare Association', 'demo123', true)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  organization_name = EXCLUDED.organization_name,
  password_hash = EXCLUDED.password_hash,
  is_active = EXCLUDED.is_active;
