import PromptCard from './PromptCard';

const PromptCardList = ({data, handleTagClick, handleEdit, handleDelete}) => {
    return (
        <div className="mt-16 prompt_layout">
        {data.map((post) => (
            <PromptCard 
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
            handleEdit={handleTagClick}
            handleDelete={handleDelete}
            />
        ))}
        </div>
    );
}

export default PromptCardList;