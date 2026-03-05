import { useState, useEffect } from 'react';

interface PostFormValues {
    title: string;
    body: string;
    userId: number;
}

interface PostFormProps {
    initialValues?: PostFormValues;
    onSubmit: (data: PostFormValues) => void;
    submitLabel: string;
    loading: boolean;
}

const DEFAULT_VALUES: PostFormValues = { title: '', body: '', userId: 0 };

export default function PostForm({
    initialValues = DEFAULT_VALUES,
    onSubmit,
    submitLabel,
    loading,
}: PostFormProps) {
    const [formData, setFormData] = useState(initialValues);

    useEffect(() => {
        setFormData(initialValues);
    }, [initialValues]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="body">Body</label>
                <textarea
                    id="body"
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows={6}
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : submitLabel}
            </button>
        </form>
    );
}