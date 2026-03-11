import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const stages = ['Applied', 'Screening', 'Test', 'Tech Interview', 'HR', 'Selected', 'Rejected'];
const stageColors = {
    Applied: '#e3f2fd', Screening: '#e8eaf6', Test: '#fff3e0',
    'Tech Interview': '#e3f2fd', HR: '#fce4ec', Selected: '#e8f5e9', Rejected: '#ffebee',
};

const CandidatePipeline = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [pipeline, setPipeline] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/company/jobs?limit=100').then(res => {
            setJobs(res.data.jobs);
            if (res.data.jobs.length > 0) setSelectedJob(res.data.jobs[0]._id);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!selectedJob) return;
        api.get(`/company/jobs/${selectedJob}/candidates`)
            .then(res => setPipeline(res.data.pipeline))
            .catch(() => { });
    }, [selectedJob]);

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { draggableId, destination } = result;
        const newStage = destination.droppableId;

        try {
            await api.put(`/company/applications/${draggableId}/stage`, { stage: newStage });
            toast.success(`Moved to ${newStage}`);
            // Refresh
            const res = await api.get(`/company/jobs/${selectedJob}/candidates`);
            setPipeline(res.data.pipeline);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div>
            <div className="page-header">
                <h1>Candidate Pipeline</h1>
                <p>Drag and drop candidates between stages</p>
            </div>

            <div className={styles.filters}>
                <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)} style={{ minWidth: 300 }}>
                    {jobs.map(j => <option key={j._id} value={j._id}>{j.title} ({j.status})</option>)}
                </select>
            </div>

            {!selectedJob ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 40 }}>Post a job first to start tracking candidates.</p>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className={styles.kanbanBoard}>
                        {stages.map(stage => (
                            <Droppable key={stage} droppableId={stage}>
                                {(provided) => (
                                    <div className={styles.kanbanColumn} ref={provided.innerRef} {...provided.droppableProps}
                                        style={{ background: stageColors[stage] || '#f1f5f9' }}>
                                        <h3>
                                            {stage}
                                            <span className={styles.count}>{pipeline[stage]?.length || 0}</span>
                                        </h3>
                                        {(pipeline[stage] || []).map((app, idx) => (
                                            <Draggable key={app._id} draggableId={app._id} index={idx}>
                                                {(prov) => (
                                                    <div className={styles.kanbanCard} ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                                                        <h4>{app.student?.studentProfile?.firstName || ''} {app.student?.studentProfile?.lastName || ''}</h4>
                                                        <p>{app.student?.email}</p>
                                                        <p>{app.student?.studentProfile?.branch} | CGPA: {app.student?.studentProfile?.cgpa}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            )}
        </div>
    );
};

export default CandidatePipeline;
