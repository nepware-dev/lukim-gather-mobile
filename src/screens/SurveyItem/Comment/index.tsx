import {useMutation} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';

import CommentActions from 'components/CommentActions';
import CommentList, {NoCommentComponent} from 'components/CommentList';
import CommentInput from 'components/CommentInput';
import EditComment from '../EditComment';
import {ConfirmBox} from 'components/ConfirmationBox';

import {_} from 'services/i18n';
import {
    CREATE_COMMENT,
    DELETE_COMMENT,
    DISLIKE_COMMENT,
    LIKE_COMMENT,
    UPDATE_COMMENT,
} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';
import Toast from 'utils/toast';

import type {
    CommentType,
    CreateCommentMutation,
    CreateCommentMutationVariables,
    DeleteCommentMutation,
    DeleteCommentMutationVariables,
    DislikeCommentMutation,
    DislikeCommentMutationVariables,
    LikeCommentMutation,
    LikeCommentMutationVariables,
    UpdateCommentMutation,
    UpdateCommentMutationVariables,
} from '@generated/types';

import styles from './styles';

interface Props {
    surveyId: string;
    commentItem?: CommentType[];
    refetch: () => void;
}

const Comment: React.FC<Props> = ({surveyId, commentItem, refetch}) => {
    const {isAuthenticated, user} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const [reply, setReply] = useState<CommentType | null>(null);
    const [isOpenCommentAction, setIsOpenCommentAction] =
        useState<boolean>(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
    const [isOpenEditInput, setIsOpenEditInput] = useState<boolean>(false);
    const [activeComment, setActiveComment] = useState<CommentType>();

    const [createComment] = useMutation<
        CreateCommentMutation,
        CreateCommentMutationVariables
    >(CREATE_COMMENT, {
        onCompleted: () => {
            Toast.show('Comment created successfully!');
            refetch();
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
        },
    });

    const [updateComment] = useMutation<
        UpdateCommentMutation,
        UpdateCommentMutationVariables
    >(UPDATE_COMMENT, {
        onCompleted: () => {
            Toast.show(_('Comment edited successfully!'));
            refetch();
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
        },
    });

    const [likeComment] = useMutation<
        LikeCommentMutation,
        LikeCommentMutationVariables
    >(LIKE_COMMENT, {
        onCompleted: () => {
            refetch();
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
        },
    });

    const [dislikeComment] = useMutation<
        DislikeCommentMutation,
        DislikeCommentMutationVariables
    >(DISLIKE_COMMENT, {
        onCompleted: () => {
            refetch();
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
        },
    });

    const [deleteComment] = useMutation<
        DeleteCommentMutation,
        DeleteCommentMutationVariables
    >(DELETE_COMMENT, {
        onCompleted: () => {
            Toast.show(_('Comment deleted successfully!'));
            refetch();
        },
        onError: err => {
            Toast.error(_('Error!'), getErrorMessage(err));
        },
    });

    const handleCommentPress = useCallback(
        message => {
            if (!isAuthenticated) {
                return Toast.error(_('You are not logged in!'));
            }
            createComment({
                variables: {
                    input: {
                        objectId: surveyId,
                        description: message,
                        contentType: 'happeningsurvey',
                        ...(reply && {parent: reply?.id}),
                    },
                },
            });
            setReply(null);
        },
        [isAuthenticated, createComment, surveyId, reply],
    );

    const handleLikePress = useCallback(
        comment => {
            if (!isAuthenticated) {
                return Toast.error(_('You are not logged in!'));
            }
            if (comment.hasLiked) {
                dislikeComment({
                    variables: {id: Number(comment.id)},
                });
            } else {
                likeComment({
                    variables: {
                        input: {
                            comment: comment.id,
                        },
                    },
                });
            }
        },
        [isAuthenticated, dislikeComment, likeComment],
    );

    const handleReplyPress = useCallback(
        comment => {
            if (!isAuthenticated) {
                return Toast.error(_('You are not logged in!'));
            }
            setReply(comment);
        },
        [isAuthenticated],
    );

    const handleLongPress = useCallback(
        comment => {
            if (!isAuthenticated) {
                return Toast.error(_('You are not logged in!'));
            }
            if (user.id !== comment?.user?.id) {
                return;
            }
            setIsOpenCommentAction(true);
            setActiveComment(comment);
        },
        [isAuthenticated, user],
    );

    const handleDeleteClick = useCallback(() => {
        setIsOpenCommentAction(false);
        setTimeout(() => {
            setOpenConfirmDelete(true);
        }, 350);
    }, []);

    const handleCancelDelete = useCallback(() => {
        setOpenConfirmDelete(false);
        setTimeout(() => {
            setIsOpenCommentAction(true);
        }, 350);
    }, []);

    const handleEditClick = useCallback(() => {
        setIsOpenCommentAction(false);
        setTimeout(() => {
            setIsOpenEditInput(true);
        }, 350);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        setIsOpenCommentAction(false);
        setOpenConfirmDelete(false);
        activeComment &&
            deleteComment({
                variables: {id: activeComment?.id},
            });
    }, [activeComment, deleteComment]);

    const handleEditConfirm = useCallback(
        editMessage => {
            setIsOpenEditInput(false);
            activeComment &&
                updateComment({
                    variables: {
                        input: {
                            id: activeComment?.id,
                            message: editMessage,
                        },
                    },
                });
        },
        [activeComment, updateComment],
    );

    return (
        <>
            <View style={styles.container}>
                {commentItem?.length === 0 && <NoCommentComponent />}
                {commentItem && (
                    <CommentList
                        comments={commentItem}
                        onLikePress={handleLikePress}
                        onReplyPress={handleReplyPress}
                        onLongPress={handleLongPress}
                    />
                )}
            </View>
            <CommentInput
                onPress={handleCommentPress}
                reply={reply}
                setReply={setReply}
            />
            <CommentActions
                isOpenCommentAction={isOpenCommentAction}
                onBackdropPress={() =>
                    setIsOpenCommentAction(!isOpenCommentAction)
                }
                onClickDeleteComment={handleDeleteClick}
                onClickEditComment={handleEditClick}
            />
            <ConfirmBox
                headerText={_('Delete?')}
                descriptionText={_(
                    'Are you sure you want to delete this comment ?',
                )}
                isOpen={openConfirmDelete}
                onCancel={handleCancelDelete}
                positiveText={_('DELETE')}
                onPositive={handleDeleteConfirm}
            />
            <EditComment
                isOpen={isOpenEditInput}
                message={activeComment?.description}
                onPress={handleEditConfirm}
                onBackdropPress={() => setIsOpenEditInput(false)}
            />
        </>
    );
};

export default Comment;
