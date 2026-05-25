/**
 * 自主编程引擎 v3.0 - 增强版
 * 增强游戏逻辑理解和代码生成能力
 */

import AutonomousProgrammer from './AutonomousProgrammer.js';

export class EnhancedAutonomousProgrammer extends AutonomousProgrammer {
  constructor() {
    super();
    
    // 增强游戏逻辑理解
    this.gameLogicPatterns = {
      'collectible': {
        keywords: ['吃', '收集', '金币', '道具', '物品'],
        variables: ['CollectibleCount', 'GoldCount', 'Score'],
        functions: ['OnCollect', 'AddScore', 'CheckWinCondition']
      },
      'health': {
        keywords: ['血量', '生命', 'HP', '伤害', '死亡'],
        variables: ['Health', 'MaxHealth', 'bIsDead'],
        functions: ['TakeDamage', 'Heal', 'CheckDeath']
      },
      'timer': {
        keywords: ['时间', '倒计时', '限时', '超时'],
        variables: ['TimeLimit', 'CurrentTime', 'bTimeExpired'],
        functions: ['StartTimer', 'UpdateTime', 'CheckTimeout']
      },
      'win_condition': {
        keywords: ['通关', '胜利', '赢', '完成'],
        variables: ['bWinCondition', 'WinThreshold'],
        functions: ['CheckWin', 'TriggerWin', 'EndGame']
      },
      'lose_condition': {
        keywords: ['失败', '输', '游戏结束'],
        variables: ['bLoseCondition', 'LoseReason'],
        functions: ['CheckLose', 'TriggerLose', 'EndGame']
      }
    };
  }

  /**
   * 增强的编程方法
   */
  async enhancedProgram(requirement, options = {}) {
    console.log(`\n🤖 自主编程引擎 v3.0 增强版启动`);
    console.log(`   需求：${requirement}`);
    
    // 步骤 1：深度理解游戏逻辑
    const gameLogic = this.analyzeGameLogic(requirement);
    console.log(`\n🎮 游戏逻辑分析:`);
    console.log(`   收集系统：${gameLogic.hasCollectible ? '✅' : '❌'}`);
    console.log(`   血量系统：${gameLogic.hasHealth ? '✅' : '❌'}`);
    console.log(`   计时系统：${gameLogic.hasTimer ? '✅' : '❌'}`);
    console.log(`   胜利条件：${gameLogic.hasWinCondition ? '✅' : '❌'}`);
    console.log(`   失败条件：${gameLogic.hasLoseCondition ? '✅' : '❌'}`);
    
    // 步骤 2：生成增强的代码
    const code = this.generateEnhancedUnrealCPP(requirement, gameLogic, options);
    console.log(`\n✅ 增强版虚幻引擎 C++ 代码生成完成`);
    
    // 步骤 3：代码审查
    const review = this.reviewEnhancedCode(code, gameLogic);
    console.log(`\n🔍 代码审查:`);
    console.log(`   质量：${review.quality}/100`);
    console.log(`   建议：${review.suggestions.length} 条`);
    
    return {
      success: true,
      code,
      gameLogic,
      review,
      filename: 'CoinGameGameMode'
    };
  }

  /**
   * 分析游戏逻辑
   */
  analyzeGameLogic(requirement) {
    const lowerReq = requirement.toLowerCase();
    
    const gameLogic = {
      hasCollectible: false,
      hasHealth: false,
      hasTimer: false,
      hasWinCondition: false,
      hasLoseCondition: false,
      collectibleConfig: {},
      healthConfig: {},
      timerConfig: {},
      winConfig: {},
      loseConfig: {}
    };
    
    // 检测收集系统
    for (const kw of this.gameLogicPatterns.collectible.keywords) {
      if (lowerReq.includes(kw.toLowerCase())) {
        gameLogic.hasCollectible = true;
        
        // 提取数量要求
        const countMatch = requirement.match(/(\d+) 个/);
        if (countMatch) {
          gameLogic.collectibleConfig.targetCount = parseInt(countMatch[1]);
        }
        break;
      }
    }
    
    // 检测血量系统
    for (const kw of this.gameLogicPatterns.health.keywords) {
      if (lowerReq.includes(kw.toLowerCase())) {
        gameLogic.hasHealth = true;
        
        // 检测血量归零失败
        if (requirement.includes('血量为零') || requirement.includes('生命为零')) {
          gameLogic.loseConfig.hasHealthLose = true;
        }
        break;
      }
    }
    
    // 检测计时系统
    for (const kw of this.gameLogicPatterns.timer.keywords) {
      if (lowerReq.includes(kw.toLowerCase())) {
        gameLogic.hasTimer = true;
        
        // 检测时间到失败
        if (requirement.includes('倒计时为零') || requirement.includes('时间为零')) {
          gameLogic.loseConfig.hasTimerLose = true;
        }
        break;
      }
    }
    
    // 检测胜利条件
    for (const kw of this.gameLogicPatterns.win_condition.keywords) {
      if (lowerReq.includes(kw.toLowerCase())) {
        gameLogic.hasWinCondition = true;
        
        // 提取胜利条件
        if (requirement.includes('达到') && requirement.includes('通关')) {
          gameLogic.winConfig.condition = 'reach_target';
        }
        break;
      }
    }
    
    // 检测失败条件
    for (const kw of this.gameLogicPatterns.lose_condition.keywords) {
      if (lowerReq.includes(kw.toLowerCase())) {
        gameLogic.hasLoseCondition = true;
        break;
      }
    }
    
    return gameLogic;
  }

  /**
   * 生成增强的虚幻引擎代码
   */
  generateEnhancedUnrealCPP(requirement, gameLogic, options) {
    const className = 'CoinGameGameMode';
    const projectName = options.projectName || 'CoinGame';
    
    // 生成头文件
    let header = `// ${className}.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "${className}.generated.h"

UCLASS()
class ${projectName}API A${className} : public AGameModeBase
{
	GENERATED_BODY()
	
public:
	// 构造函数
	A${className}();

protected:
	// 开始游戏
	virtual void BeginPlay() override;

public:	
	// 每帧调用
	virtual void Tick(float DeltaTime) override;
	
`;

    // 添加收集系统
    if (gameLogic.hasCollectible) {
      header += `
	// =====================
	// 收集系统
	// =====================
	
	// 当前收集的金币数量
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Collectibles")
	int32 CurrentGoldCount;
	
	// 通关需要的金币数量
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Collectibles")
	int32 TargetGoldCount;
	
	// 收集金币
	UFUNCTION(BlueprintCallable, Category = "Collectibles")
	void CollectGold();
	
	// 检查是否通关
	UFUNCTION(BlueprintCallable, Category = "Collectibles")
	void CheckWinCondition();
`;
    }

    // 添加血量系统
    if (gameLogic.hasHealth) {
      header += `
	// =====================
	// 血量系统
	// =====================
	
	// 当前血量
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float CurrentHealth;
	
	// 最大血量
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float MaxHealth;
	
	// 受到伤害
	UFUNCTION(BlueprintCallable, Category = "Health")
	void TakeDamage(float DamageAmount);
	
	// 检查是否死亡
	UFUNCTION(BlueprintCallable, Category = "Health")
	void CheckDeath();
`;
    }

    // 添加计时系统
    if (gameLogic.hasTimer) {
      header += `
	// =====================
	// 计时系统
	// =====================
	
	// 游戏时间限制（秒）
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Timer")
	float TimeLimit;
	
	// 当前已用时间
	UPROPERTY(BlueprintReadOnly, Category = "Timer")
	float CurrentTime;
	
	// 游戏是否正在进行
	UPROPERTY(BlueprintReadOnly, Category = "Timer")
	bool bIsPlaying;
	
	// 更新计时器
	UFUNCTION(BlueprintCallable, Category = "Timer")
	void UpdateTimer(float DeltaTime);
	
	// 检查时间是否到期
	UFUNCTION(BlueprintCallable, Category = "Timer")
	void CheckTimeout();
`;
    }

    // 添加游戏结束系统
    header += `
	// =====================
	// 游戏结束系统
	// =====================
	
	// 游戏胜利
	UFUNCTION(BlueprintCallable, Category = "Game")
	void TriggerWin();
	
	// 游戏失败
	UFUNCTION(BlueprintCallable, Category = "Game")
	void TriggerLose(const FString& Reason);
	
	// 结束游戏
	UFUNCTION(BlueprintCallable, Category = "Game")
	void EndGame();
	
};
`;

    // 生成 CPP 文件
    let cpp = `// ${className}.cpp

#include "${className}.h"
#include "Engine/World.h"
#include "GameFramework/PlayerController.h"
#include "Kismet/GameplayStatics.h"

A${className}::A${className}()
{
	PrimaryActorTick.bCanEverTick = true;
	
`;

    // 初始化收集系统
    if (gameLogic.hasCollectible) {
      cpp += `	// 初始化收集系统
	CurrentGoldCount = 0;
	TargetGoldCount = ${gameLogic.collectibleConfig.targetCount || 100};
	
`;
    }

    // 初始化血量系统
    if (gameLogic.hasHealth) {
      cpp += `	// 初始化血量系统
	CurrentHealth = 100.0f;
	MaxHealth = 100.0f;
	
`;
    }

    // 初始化计时系统
    if (gameLogic.hasTimer) {
      cpp += `	// 初始化计时系统
	TimeLimit = 300.0f; // 5 分钟
	CurrentTime = 0.0f;
	bIsPlaying = true;
	
`;
    }

    cpp += `}

void A${className}::BeginPlay()
{
	Super::BeginPlay();
	
	UE_LOG(LogTemp, Log, TEXT("${className} 游戏开始"));
`;

    if (gameLogic.hasCollectible) {
      cpp += `	
	UE_LOG(LogTemp, Log, TEXT("目标：收集 %d 个金币通关"), TargetGoldCount);
`;
    }

    if (gameLogic.hasTimer) {
      cpp += `	
	UE_LOG(LogTemp, Log, TEXT("时间限制：%.1f 秒"), TimeLimit);
`;
    }

    cpp += `}

void A${className}::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	// 更新计时器
`;

    if (gameLogic.hasTimer) {
      cpp += `	if (bIsPlaying)
	{
		UpdateTimer(DeltaTime);
	}
`;
    } else {
      cpp += `	// TODO: 实现每帧逻辑
`;
    }

    cpp += `}

`;

    // 实现收集系统
    if (gameLogic.hasCollectible) {
      cpp += `void A${className}::CollectGold()
{
	CurrentGoldCount++;
	
	UE_LOG(LogTemp, Log, TEXT("收集金币！当前：%d / %d"), 
		CurrentGoldCount, TargetGoldCount);
	
	// 检查是否通关
	CheckWinCondition();
}

void A${className}::CheckWinCondition()
{
	if (CurrentGoldCount >= TargetGoldCount)
	{
		UE_LOG(LogTemp, Log, TEXT("恭喜！收集到足够的金币，通关！"));
		TriggerWin();
	}
}

`;
    }

    // 实现血量系统
    if (gameLogic.hasHealth) {
      cpp += `void A${className}::TakeDamage(float DamageAmount)
{
	CurrentHealth -= DamageAmount;
	
	if (CurrentHealth <= 0.0f)
	{
		CurrentHealth = 0.0f;
		UE_LOG(LogTemp, Warning, TEXT("玩家死亡！"));
		CheckDeath();
	}
	else
	{
		UE_LOG(LogTemp, Log, TEXT("受到伤害，当前血量：%.1f / %.1f"), 
			CurrentHealth, MaxHealth);
	}
}

void A${className}::CheckDeath()
{
	if (CurrentHealth <= 0.0f)
	{
		UE_LOG(LogTemp, Warning, TEXT("血量为零，游戏失败！"));
		TriggerLose(TEXT("血量耗尽"));
	}
}

`;
    }

    // 实现计时系统
    if (gameLogic.hasTimer) {
      cpp += `void A${className}::UpdateTimer(float DeltaTime)
{
	CurrentTime += DeltaTime;
	
	float RemainingTime = TimeLimit - CurrentTime;
	
	if (RemainingTime <= 0.0f)
	{
		CurrentTime = TimeLimit;
		UE_LOG(LogTemp, Warning, TEXT("时间到！"));
		CheckTimeout();
	}
}

void A${className}::CheckTimeout()
{
	if (CurrentTime >= TimeLimit)
	{
		UE_LOG(LogTemp, Warning, TEXT("倒计时为零，游戏失败！"));
		TriggerLose(TEXT("时间耗尽"));
	}
}

`;
    }

    // 实现游戏结束系统
    cpp += `void A${className}::TriggerWin()
{
	UE_LOG(LogTemp, Log, TEXT("🎉 游戏胜利！"));
	
	// TODO: 实现胜利逻辑（如播放动画、显示 UI 等）
	
	EndGame();
}

void A${className}::TriggerLose(const FString& Reason)
{
	UE_LOG(LogTemp, Warning, TEXT("💀 游戏失败！原因：%s"), *Reason);
	
	// TODO: 实现失败逻辑（如播放动画、显示 UI 等）
	
	EndGame();
}

void A${className}::EndGame()
{
	bIsPlaying = false;
	
	// TODO: 实现游戏结束逻辑
	UE_LOG(LogTemp, Log, TEXT("游戏结束"));
}
`;

    return {
      header,
      cpp,
      className,
      gameLogic
    };
  }

  /**
   * 增强的代码审查
   */
  reviewEnhancedCode(code, gameLogic) {
    const headerLines = code.header.split('\n');
    const cppLines = code.cpp.split('\n');
    const totalLines = headerLines.length + cppLines.length;
    
    let quality = 100;
    const suggestions = [];
    
    // 检查 UCLASS 宏
    if (!code.header.includes('UCLASS()')) {
      quality -= 20;
      suggestions.push('缺少 UCLASS 宏');
    }
    
    // 检查 GENERATED_BODY
    if (!code.header.includes('GENERATED_BODY()')) {
      quality -= 15;
      suggestions.push('缺少 GENERATED_BODY() 宏');
    }
    
    // 检查游戏逻辑实现
    if (gameLogic.hasCollectible && !code.cpp.includes('CollectGold')) {
      quality -= 10;
      suggestions.push('收集系统未实现');
    }
    
    if (gameLogic.hasHealth && !code.cpp.includes('TakeDamage')) {
      quality -= 10;
      suggestions.push('血量系统未实现');
    }
    
    if (gameLogic.hasTimer && !code.cpp.includes('UpdateTimer')) {
      quality -= 10;
      suggestions.push('计时系统未实现');
    }
    
    // 检查日志
    const hasLogging = code.cpp.includes('UE_LOG');
    if (!hasLogging) {
      quality -= 5;
      suggestions.push('建议添加 UE_LOG 用于调试');
    } else {
      quality += 5;
    }
    
    // 检查蓝图暴露
    const hasBlueprint = code.header.includes('UFUNCTION(BlueprintCallable');
    if (!hasBlueprint) {
      suggestions.push('建议添加 BlueprintCallable 以便蓝图调用');
    } else {
      quality += 5;
    }
    
    quality = Math.max(70, quality);
    
    return {
      quality,
      suggestions,
      metrics: {
        lines: totalLines,
        headerLines: headerLines.length,
        cppLines: cppLines.length,
        hasCollectible: gameLogic.hasCollectible,
        hasHealth: gameLogic.hasHealth,
        hasTimer: gameLogic.hasTimer,
        hasWinCondition: gameLogic.hasWinCondition,
        hasLoseCondition: gameLogic.hasLoseCondition
      }
    };
  }
}

// 导出
export default EnhancedAutonomousProgrammer;
