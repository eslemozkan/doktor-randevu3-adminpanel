-- Enable Row Level Security
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO users (email, password)
VALUES 
    ('admin@example.com', 'admin123'),
    ('test@example.com', 'test123')
ON CONFLICT (email) DO NOTHING;

-- Create policies for row level security
CREATE POLICY "Users are viewable by admin" ON users
    FOR SELECT
    TO authenticated
    USING (auth.role() = 'admin');

CREATE POLICY "Users can be updated by admin" ON users
    FOR UPDATE
    TO authenticated
    USING (auth.role() = 'admin');

CREATE POLICY "Users can be deleted by admin" ON users
    FOR DELETE
    TO authenticated
    USING (auth.role() = 'admin');

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Appointments table for booking form
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for appointments
INSERT INTO appointments (name, email, phone, appointment_date, appointment_time, notes, status)
VALUES 
    ('Ahmet Yılmaz', 'ahmet@example.com', '5551234567', '2024-03-25', '14:30', 'İlk muayene', 'pending'),
    ('Ayşe Demir', 'ayse@example.com', '5559876543', '2024-03-26', '15:00', 'Kontrol', 'confirmed')
ON CONFLICT DO NOTHING;

-- Sample data for blog posts
INSERT INTO blog_posts (title, category, content, image_url)
VALUES 
    ('Sağlıklı Yaşam İpuçları', 'Sağlık', 'Sağlıklı bir yaşam için öneriler...', 'https://example.com/image1.jpg'),
    ('Diş Sağlığı', 'Dental', 'Diş sağlığı hakkında bilmeniz gerekenler...', 'https://example.com/image2.jpg')
ON CONFLICT DO NOTHING; 