BEGIN;

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    inn VARCHAR(12) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(10),
    file_size FLOAT,
    storage_path TEXT,
    analysis_result TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY,
    document_id UUID REFERENCES documents(id),
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    meta_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DELETE FROM document_chunks;
DELETE FROM documents;
DELETE FROM organizations;

INSERT INTO organizations (id, name, inn) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'УК Тестовая', '1234567890');

INSERT INTO documents (id, organization_id, filename, file_type) 
VALUES ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'ЖК_РФ_Выдержки.pdf', 'pdf');

INSERT INTO document_chunks (id, document_id, content, embedding, meta_info) 
VALUES 
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 'Статья 161. Выбор способа управления многоквартирным домом. Собственники обязаны выбрать один из способов управления...', array_fill(0::float, ARRAY[1536])::vector, 'ст. 161 ЖК РФ'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440000', 'Статья 155. Оплата жилого помещения и коммунальных услуг. Плата вносится ежемесячно до десятого числа месяца...', array_fill(0::float, ARRAY[1536])::vector, 'ст. 155 ЖК РФ'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440000', 'Статья 157. Размер платы за коммунальные услуги рассчитывается исходя из объема потребляемых услуг...', array_fill(0::float, ARRAY[1536])::vector, 'ст. 157 ЖК РФ');

COMMIT;
