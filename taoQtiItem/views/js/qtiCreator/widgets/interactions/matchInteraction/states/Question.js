define([
    'jquery',
    'lodash',
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/blockInteraction/states/Question',
    'taoQtiItem/qtiCreator/widgets/interactions/associateInteraction/states/Question',
    'tpl!taoQtiItem/qtiCreator/tpl/toolbars/matchInteraction.adder',
    'tpl!taoQtiItem/qtiCreator/tpl/interactions/matchInteraction.row',
    'tpl!taoQtiItem/qtiCreator/tpl/interactions/matchInteraction.cell',
    'taoQtiItem/qtiCreator/helper/adaptSize'
], function($, _, stateFactory, Question, AssociateInteractionQuestionState, adderTpl, rowTpl, cellTpl, adaptSize){

    var MatchInteractionStateQuestion = stateFactory.extend(Question);

    MatchInteractionStateQuestion.prototype.initForm = AssociateInteractionQuestionState.prototype.initForm;

    MatchInteractionStateQuestion.prototype.addNewChoiceButton = function(){

        var widget = this.widget,
            interaction = widget.element,
            $matchArea = widget.$container.find('.match-interaction-area'),
            qtiChoiceClassName = 'simpleAssociableChoice.matchInteraction';

        var _postRender = function(choice){
            
            choice.postRender({
                ready : function(widget){
                    //transition state directly back to "question"
                    widget.changeState('question');
                }
            }, qtiChoiceClassName);
        };

        if(!$matchArea.find('.add-option').length){
            
            $matchArea.append(adderTpl());
            
            $matchArea.find('.add-options').show();
            
            $matchArea.find('.add-option[data-role=add-col]').on('click', function(){
                
                //match set 0
                var choice = interaction.createChoice(0);
                
                $matchArea.find('thead > tr').append(choice.render(qtiChoiceClassName));
                $matchArea.find('tbody > tr').append(cellTpl({}));
                
                _postRender(choice);
            });

            $matchArea.find('.add-option[data-role=add-row]').on('click', function(){
                
                //match set 1
                var choice = interaction.createChoice(1);
                
                $matchArea.find('tbody').append(rowTpl({
                    choice : choice.render(qtiChoiceClassName),
                    otherMatchSetCount : _.size(interaction.choices[0])
                }));
                
                _postRender(choice);
            });
        }

        $('.qti-item').on('toolbarchange', function() {
            $matchArea.find('tbody .mini-tlb').each(function() {
                var $toolbar = $(this);
                $toolbar.css({ left: ($toolbar.width() + 10) * -1, top: -1} );
            });
        });

        //listen for height changes
        $matchArea.find('tr ').each(function() {
            var $elements = $(this).find('[data-html-editable=true]');
            widget.on('containerBodyChange', function(){
                adaptSize.height($elements);
            });
        });

    };

    return MatchInteractionStateQuestion;
});