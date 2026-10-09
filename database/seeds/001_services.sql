-- Seed: Services & Sub-Services & Rate Cards for Faisalabad
-- All prices in PKR

-- 1. ELECTRICIAN
INSERT INTO services (id, name, description, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Electrician', 'Electrical repair and installation services', 1);

INSERT INTO sub_services (id, service_id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'Switchboard Repair', 'Fix or replace broken switchboards'),
  ('11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'Fan Installation', 'Install ceiling or wall fans'),
  ('11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'Wiring & Cabling', 'Home or office wiring work'),
  ('11111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'MCB / Fuse Repair', 'MCB tripping or fuse issues'),
  ('11111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'Light Fixture Installation', 'Install or replace lights');

INSERT INTO rate_cards (sub_service_id, base_price, price_unit) VALUES
  ('11111111-1111-1111-1111-111111111101', 300.00, 'fixed'),
  ('11111111-1111-1111-1111-111111111102', 400.00, 'fixed'),
  ('11111111-1111-1111-1111-111111111103', 500.00, 'per_hour'),
  ('11111111-1111-1111-1111-111111111104', 250.00, 'fixed'),
  ('11111111-1111-1111-1111-111111111105', 350.00, 'fixed');

-- 2. PLUMBER
INSERT INTO services (id, name, description, sort_order) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Plumber', 'Plumbing and water supply services', 2);

INSERT INTO sub_services (id, service_id, name, description) VALUES
  ('22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222222', 'Tap / Faucet Repair', 'Fix or replace leaking taps'),
  ('22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222222', 'Drain Unclogging', 'Clear blocked drains and pipes'),
  ('22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222222', 'Toilet Repair', 'Fix toilet flush, seat or cistern'),
  ('22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222222', 'Water Tank Installation', 'Install or repair water tanks'),
  ('22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222222', 'Pipe Leak Fix', 'Detect and fix pipe leaks');

INSERT INTO rate_cards (sub_service_id, base_price, price_unit) VALUES
  ('22222222-2222-2222-2222-222222222201', 200.00, 'fixed'),
  ('22222222-2222-2222-2222-222222222202', 350.00, 'fixed'),
  ('22222222-2222-2222-2222-222222222203', 300.00, 'fixed'),
  ('22222222-2222-2222-2222-222222222204', 600.00, 'fixed'),
  ('22222222-2222-2222-2222-222222222205', 400.00, 'fixed');

-- 3. AC TECHNICIAN
INSERT INTO services (id, name, description, sort_order) VALUES
  ('33333333-3333-3333-3333-333333333333', 'AC Technician', 'Air conditioner repair and maintenance', 3);

INSERT INTO sub_services (id, service_id, name, description) VALUES
  ('33333333-3333-3333-3333-333333333301', '33333333-3333-3333-3333-333333333333', 'AC Gas Refill', 'Recharge AC refrigerant gas'),
  ('33333333-3333-3333-3333-333333333302', '33333333-3333-3333-3333-333333333333', 'AC Service / Cleaning', 'Full AC wash and service'),
  ('33333333-3333-3333-3333-333333333303', '33333333-3333-3333-3333-333333333333', 'AC Installation', 'Install window or split AC'),
  ('33333333-3333-3333-3333-333333333304', '33333333-3333-3333-3333-333333333333', 'AC Not Cooling Fix', 'Diagnose and fix cooling issues'),
  ('33333333-3333-3333-3333-333333333305', '33333333-3333-3333-3333-333333333333', 'AC Remote / PCB Repair', 'Repair remote or PCB board');

INSERT INTO rate_cards (sub_service_id, base_price, price_unit) VALUES
  ('33333333-3333-3333-3333-333333333301', 2500.00, 'fixed'),
  ('33333333-3333-3333-3333-333333333302', 1200.00, 'fixed'),
  ('33333333-3333-3333-3333-333333333303', 1500.00, 'fixed'),
  ('33333333-3333-3333-3333-333333333304', 500.00, 'per_visit'),
  ('33333333-3333-3333-3333-333333333305', 800.00, 'fixed');

-- 4. CARPENTER
INSERT INTO services (id, name, description, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Carpenter', 'Wood work and furniture repair', 4);

INSERT INTO sub_services (id, service_id, name, description) VALUES
  ('44444444-4444-4444-4444-444444444401', '44444444-4444-4444-4444-444444444444', 'Door / Window Repair', 'Fix or adjust doors and windows'),
  ('44444444-4444-4444-4444-444444444402', '44444444-4444-4444-4444-444444444444', 'Furniture Repair', 'Repair broken furniture'),
  ('44444444-4444-4444-4444-444444444403', '44444444-4444-4444-4444-444444444444', 'Cabinet Making', 'Custom cabinet or shelf installation'),
  ('44444444-4444-4444-4444-444444444404', '44444444-4444-4444-4444-444444444444', 'Lock / Handle Fix', 'Fix or replace door locks');

INSERT INTO rate_cards (sub_service_id, base_price, price_unit) VALUES
  ('44444444-4444-4444-4444-444444444401', 400.00, 'fixed'),
  ('44444444-4444-4444-4444-444444444402', 500.00, 'fixed'),
  ('44444444-4444-4444-4444-444444444403', 800.00, 'per_hour'),
  ('44444444-4444-4444-4444-444444444404', 300.00, 'fixed');

-- 5. PAINTER
INSERT INTO services (id, name, description, sort_order) VALUES
  ('55555555-5555-5555-5555-555555555555', 'Painter', 'Interior and exterior painting services', 5);

INSERT INTO sub_services (id, service_id, name, description) VALUES
  ('55555555-5555-5555-5555-555555555501', '55555555-5555-5555-5555-555555555555', 'Room Painting', 'Paint one or more rooms'),
  ('55555555-5555-5555-5555-555555555502', '55555555-5555-5555-5555-555555555555', 'Exterior Wall Painting', 'Paint outside walls of house'),
  ('55555555-5555-5555-5555-555555555503', '55555555-5555-5555-5555-555555555555', 'Gate / Grille Painting', 'Paint metal gates or grilles'),
  ('55555555-5555-5555-5555-555555555504', '55555555-5555-5555-5555-555555555555', 'Texture / Polish Work', 'Special texture or polish finishes');

INSERT INTO rate_cards (sub_service_id, base_price, price_unit) VALUES
  ('55555555-5555-5555-5555-555555555501', 2000.00, 'fixed'),
  ('55555555-5555-5555-5555-555555555502', 3000.00, 'fixed'),
  ('55555555-5555-5555-5555-555555555503', 1000.00, 'fixed'),
  ('55555555-5555-5555-5555-555555555504', 1500.00, 'fixed');
