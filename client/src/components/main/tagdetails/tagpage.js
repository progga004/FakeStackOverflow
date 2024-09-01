import React,{useState} from 'react';
import Tagdetails from './tagdetails';
import Displaytag from '../display/displaytags';
import Questionform from '../form/questionform';

export default function Tagpage({ onTagSelected,tags,displayContent,userId,isGuest }) {
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [tagDeleted, setTagDeleted] = useState(false);
    console.log("Am I here in tagpage for admin");
    if (showQuestionForm) {
        return (
          <Questionform
            toggleShowForm={() => setShowQuestionForm(false)}
          />
        );
    }
    return (
        <>
            <Tagdetails toggleShowQuestionForm={() => setShowQuestionForm(true)} displayContent={displayContent} 
            tagDeleted={tagDeleted}
            setTagDeleted={setTagDeleted} userId={userId} isGuest={isGuest}/>
            <Displaytag onTagSelected={onTagSelected} tags={tags} displayContent={displayContent}
            setTagDeleted={setTagDeleted} userId={userId} />
        </>
    );
}
